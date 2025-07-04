import json
import mysql.connector

# Configuration connexion MySQL
db_config = {
    'host': '127.0.0.1',
    'port': 8889,
    'user': 'root',
    'password': 'root',
    'database': 'pokedex'
}

# Connexion
conn = mysql.connector.connect(**db_config)
cursor = conn.cursor()

# Vider les tables dans le bon ordre
cursor.execute("DELETE FROM favoris")
cursor.execute("DELETE FROM pokemon_type")
cursor.execute("DELETE FROM pokemon")
cursor.execute("DELETE FROM type")
conn.commit()

# Charger les fichiers JSON
with open('types.json', 'r', encoding='utf-8') as f:
    types_data = json.load(f)

with open('pokedex.json', 'r', encoding='utf-8') as f:
    pokedex_data = json.load(f)

# Insérer les types
type_name_to_id = {}
for type_entry in types_data:
    name = type_entry['english']
    cursor.execute("INSERT IGNORE INTO type (name) VALUES (%s)", (name,))
    conn.commit()
    cursor.execute("SELECT id FROM type WHERE name = %s", (name,))
    type_id = cursor.fetchone()[0]
    type_name_to_id[name] = type_id

# Insérer les pokemons
for pokemon in pokedex_data:
    p_id = pokemon['id']
    names = pokemon['name']
    name_en = names.get('english', '')
    name_fr = names.get('french', '')
    name_jp = names.get('japanese', '')
    name_cn = names.get('chinese', '')
    species = pokemon.get('species', '')
    description = pokemon.get('description', '')
    base = pokemon.get('base', {})  # ✅ remplacement ici

    hp = base.get('HP', 0)
    attack = base.get('Attack', 0)
    defense = base.get('Defense', 0)
    sp_attack = base.get('Sp. Attack', 0)
    sp_defense = base.get('Sp. Defense', 0)
    speed = base.get('Speed', 0)
    image = pokemon.get('image', {}).get('hires', '')

    cursor.execute("""
        INSERT IGNORE INTO pokemon 
        (id, name_en, name_fr, name_jp, name_cn, species, description, hp, attack, defense, sp_attack, sp_defense, speed, image)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (p_id, name_en, name_fr, name_jp, name_cn, species, description, hp, attack, defense, sp_attack, sp_defense, speed, image))
    conn.commit()

    for t in pokemon.get('type', []):
        type_id = type_name_to_id.get(t)
        if type_id:
            cursor.execute("INSERT IGNORE INTO pokemon_type (pokemon_id, type_id) VALUES (%s, %s)", (p_id, type_id))
            conn.commit()

print("✅ Import terminé")
cursor.close()
conn.close()
