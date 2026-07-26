import os

root = '/Users/francoviegaslloverasgmail.com/Projects/molino/app'

replacements = {
    '&aacute;': 'á',
    '&eacute;': 'é',
    '&iacute;': 'í',
    '&oacute;': 'ó',
    '&uacute;': 'ú',
    '&Aacute;': 'Á',
    '&Eacute;': 'É',
    '&Iacute;': 'Í',
    '&Oacute;': 'Ó',
    '&Uacute;': 'Ú',
    '&ntilde;': 'ñ',
    '&Ntilde;': 'Ñ',
    '&auml;': 'ä',
    '&euml;': 'ë',
    '&iuml;': 'ï',
    '&ouml;': 'ö',
    '&uuml;': 'ü',
    '&Auml;': 'Ä',
    '&Euml;': 'Ë',
    '&Iuml;': 'Ï',
    '&Ouml;': 'Ö',
    '&Uuml;': 'Ü',
    '&ccaron;': 'č',
    '&Ccaron;': 'Č',
    '&scaron;': 'š',
    '&Scaron;': 'Š',
    '&zcaron;': 'ž',
    '&Zcaron;': 'Ž',
    '&iquest;': '¿',
    '&iexcl;': '¡',
    '&ndash;': '–',
    '&mdash;': '—',
    '&middot;': '·',
    '&lsquo;': ''',
    '&rsquo;': ''',
    '&ldquo;': '"',
    '&rdquo;': '"',
}

for dirpath, dirnames, filenames in os.walk(root):
    for filename in filenames:
        if filename.endswith('.tsx') or filename.endswith('.ts'):
            filepath = os.path.join(dirpath, filename)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                original = content
                changed = False

                for entity, char in replacements.items():
                    if entity in content:
                        content = content.replace(entity, char)
                        changed = True

                if changed:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f'Fixed: {filepath}')
            except Exception as e:
                print(f'Error in {filepath}: {e}')

print('Done')
