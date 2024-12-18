# xml2perfil.py

import xml.etree.ElementTree as ET

def parse_xml(xml_file):

    tree = ET.parse(xml_file)
    root = tree.getroot()

    coordinates = []
    namespace = {'': 'http://www.uniovi.es'}

    for tramo in root.findall(".//tramo", namespaces = namespace):
        coord = tramo.find("coordenada", namespaces = namespace)
        if coord is not None:
            lat = float(coord.get("latitud"))
            lon = float(coord.get("longitud"))
            alt = float(coord.get("altitud"))
            coordinates.append((lat, lon, alt))

    return coordinates

def create_svg_content(coordinates, width=800, height=400, margin=50):
    altitudes = [coord[2] for coord in coordinates]
    min_alt, max_alt = min(altitudes), max(altitudes)

    step = (width - 2 * margin) / (len(coordinates) - 1)

    svg_content = [
        '<?xml version="1.0" encoding="UTF-8" ?>',
        f'<svg xmlns="http://www.w3.org/2000/svg" version="2.0" width="{width}" height="{height}">',
    ]

    points = [f"{margin},{height}"]  # Empieza abajo izquierda
    for i, (_, _, alt) in enumerate(coordinates):
        x = margin + i * step
        y = margin + max_alt - alt
        points.append(f"{x},{y}")
    points.append(f"{width - margin},{height}")  # Vuelve a la base
    points.append(f"{margin},{height}")  # Conecta con el punto inicial

    points_str = " ".join(points)
    svg_content.append(f'<polyline points="{points_str}" style="fill:white;stroke:red;stroke-width:4" />')

    svg_content.append('</svg>')

    return "\n".join(svg_content)

def save_svg(svg_content, svg_file):
    with open(svg_file, 'w') as file:
        file.write(svg_content)

def main():
    xml_file = "circuitoEsquema.xml"
    svg_file = "altimetria.svg"

    coordinates = parse_xml(xml_file)
    svg_content = create_svg_content(coordinates)
    save_svg(svg_content, svg_file)

    print("Conversión completada con éxito: 'altimetria.svg' creado.")

if __name__ == "__main__":
    main()
