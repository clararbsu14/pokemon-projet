import json
import mysql.connector

# Configuration connexion MySQL
db_config = {
    'host': 'localhost',
    'port': 8889,
    'user': 'root',
    'password': 'root',
    'database': 'pokedex'
}


# Connexion
conn = mysql.connector.connect(**db_config)
cursor = conn.cursor()

# Charger les fichiers JSON
with open('types.json', 'r', encoding='utf-8') as f:
    types_data = json.load(f)

with open('pokedex.json', 'r', encoding='utf-8') as f:
    pokedex_data = json.load(f)

# 1️⃣ Insert types
type_name_to_id = {}
for type_entry in types_data:
    name = type_entry['english']
    cursor.execute("INSERT IGNORE INTO type (name) VALUES (%s)", (name,))
    conn.commit()
    cursor.execute("SELECT id FROM type WHERE name = %s", (name,))
    type_id = cursor.fetchone()[0]
    type_name_to_id[name] = type_id

# 2️⃣ Insert pokemons
for pokemon in pokedex_data:
    p_id = pokemon['id']
    names = pokemon['name']
    base = pokemon.get('base', {})
    desc = pokemon.get('description', '')
    species = pokemon.get('species', '')
    image = pokemon.get('image', {}).get('hires', '')

    # Insert pokemon
    cursor.execute("""
        INSERT IGNORE INTO pokemon 
        (id, name_en, name_fr, name_jp, name_cn, species, description, hp, attack, defense, sp_attack, sp_defense, speed, image)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        p_id,
        names.get('english'),
        names.get('french'),
        names.get('japanese'),
        names.get('chinese'),
        species,
        desc,
        base.get('HP'),
        base.get('Attack'),
        base.get('Defense'),
        base.get('Sp. Attack'),
        base.get('Sp. Defense'),
        base.get('Speed'),
        image
    ))
    conn.commit()

    # Insert pokemon_type relations
    for t in pokemon['type']:
        type_id = type_name_to_id.get(t)
        if type_id:
            cursor.execute("""
                INSERT IGNORE INTO pokemon_type (pokemon_id, type_id) VALUES (%s, %s)
            """, (p_id, type_id))
            conn.commit()

print("✅ Import terminé avec succès !")

# Cleanup
cursor.close()
conn.close()
