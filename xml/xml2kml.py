# xml2kml.py

import xml.etree.ElementTree as ET

def prologoKML(archivo):
    archivo.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    archivo.write('<kml xmlns="http://www.opengis.net/kml/2.2">\n')
    archivo.write("<Document>\n")
    archivo.write("<Placemark>\n")
    archivo.write("<name>Circuito de Spa-Francorchamps</name>\n")
    archivo.write("<LineString>\n")
    archivo.write("<extrude>1</extrude>\n")
    archivo.write("<tessellate>1</tessellate>\n")
    archivo.write("<coordinates>\n")

def epilogoKML(archivo):
    archivo.write("</coordinates>\n")
    archivo.write("<altitudeMode>relativeToGround</altitudeMode>\n")
    archivo.write("</LineString>\n")
    archivo.write("<Style id='lineaRoja'>\n")
    archivo.write("<LineStyle>\n")
    archivo.write("<color>#ff0000ff</color>\n")
    archivo.write("<width>5</width>\n")
    archivo.write("</LineStyle>\n")
    archivo.write("</Style>\n")
    archivo.write("</Placemark>\n")
    archivo.write("</Document>\n")
    archivo.write("</kml>\n")

def main():
    try:
        tree = ET.parse("circuitoEsquema.xml")
        root = tree.getroot()
    except IOError:
        print("No se encuentra el archivo 'circuitoEsquema.xml'")
        return

    try:
        salida = open("circuito.kml", 'w')
    except IOError:
        print("No se puede crear el archivo 'circuito.kml'")
        return

    prologoKML(salida)

    namespace = {'': 'http://www.uniovi.es'}

    for tramo in root.findall(".//tramo", namespaces = namespace):
        coordenada = tramo.find("coordenada", namespaces = namespace)
        if coordenada is not None:
            lon = coordenada.get("longitud")
            lat = coordenada.get("latitud")
            salida.write(f"{lon},{lat}\n")

    epilogoKML(salida)

    salida.close()
    print("Conversión completada con éxito: 'circuito.kml' creado.")

if __name__ == "__main__":
    main()
