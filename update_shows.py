# -*- coding: utf-8 -*-

import json
from io import BytesIO

import requests
import pandas as pd


# =========================
# CONFIGURATION
# =========================

URL = "https://1drv.ms/x/c/334dcc5b15be7268/IQDNuBgeqY2BQIde5n2YBDAvAbukF_q3z7R2R9RhDpR2bXM"

DOWNLOAD_URL = URL + ("&" if "?" in URL else "?") + "download=1"


# =========================
# DOWNLOAD EXCEL
# =========================

response = requests.get(DOWNLOAD_URL)

response.raise_for_status()

excel = BytesIO(response.content)


# =========================
# READ "HAVE" SHEET
# =========================

df = pd.read_excel(
    excel,
    sheet_name="Have",
    engine="openpyxl"
)


# =========================
# SORT
# Nature → Show
# =========================

df = df.sort_values(
    by=["NATURE", "SHOW"],
    key=lambda col: col.astype(str).str.lower()
)


# =========================
# CLEAN VALUES
# =========================

def clean(value):
    """Convertit une cellule vide en 'Missing info'."""

    if pd.isna(value) or str(value).strip() == "":
        return "Missing info"

    return str(value).strip()


# =========================
# CREATE SHOW DATA
# =========================

def create_show_data(row):

    show = clean(row["SHOW"])
    show_type = clean(row["PLAY / MUSICAL"])
    nature = clean(row["NATURE"])

    date = clean(row["DATE"])

    if date != "Missing info":
        date = " ".join(
            element
            for element in date.split(" ")[::-1]
        )

    source = clean(row["SOURCE"])
    cast = clean(row["CAST"])
    file = clean(row["FILE"])
    notes = clean(row["NOTES"])
    subtitles = clean(row["SUBTITLES"])
    status = clean(row["STATUS"])


    # =========================
    # CAST
    # =========================

    cast_members = []

    if cast != "Missing info":

        for member in cast.split(","):

            member = member.strip()

            if not member:
                continue


            if "(" in member and member.endswith(")"):

                actor, character = member.rsplit("(", 1)

                actor = actor.strip()
                character = character[:-1].strip()

                cast_members.append({
                    "actor": actor,
                    "character": character
                })


            else:

                cast_members.append({
                    "actor": member,
                    "character": ""
                })


    # =========================
    # RETURN DATA
    # =========================

    return {
        "show": show,
        "type": show_type,
        "nature": nature,
        "date": date,
        "source": source,
        "file": file,
        "cast": cast_members,
        "notes": notes,
        "subtitles": subtitles,
        "status": status
    }


# =========================
# CREATE ALL SHOWS
# =========================

shows = [
    create_show_data(row)
    for _, row in df.iterrows()
]


# =========================
# EXPORT JSON
# =========================

with open(
    "shows.json",
    "w",
    encoding="utf-8"
) as file:

    json.dump(
        shows,
        file,
        ensure_ascii=False,
        indent=2
    )


# =========================
# DONE
# =========================

print(
    f"{len(shows)} spectacles exportés dans shows.json"
)
