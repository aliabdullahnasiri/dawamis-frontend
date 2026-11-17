"""Generate reviewed schema types from a backend OpenAPI snapshot (stdlib only)."""
import json, sys
from pathlib import Path
schema=json.loads(Path(sys.argv[1]).read_text())
def ts(s):
 if '$ref' in s: return s['$ref'].split('/')[-1]
 for key in ('anyOf','oneOf'):
  if key in s: return ' | '.join(ts(v) for v in s[key])
 if 'enum' in s: return ' | '.join(json.dumps(v) for v in s['enum'])
 kind=s.get('type')
 if kind=='null': return 'null'
 if kind=='boolean': return 'boolean'
 if kind in ('number','integer'): return 'number'
 if kind=='string': return 'string'
 if kind=='array': return '('+ts(s.get('items',{}))+')[]'
 if kind=='object' or 'properties' in s:
  props=s.get('properties',{})
  if not props: return 'Record<string, unknown>'
  return '{ '+ '; '.join(json.dumps(k)+('' if k in s.get('required',[]) else '?')+': '+ts(v) for k,v in props.items())+' }'
 return 'unknown'
lines=['// Generated from backend OpenAPI. Do not edit manually.','// Decimal input unions permit numbers in the backend; frontend financial forms MUST send string amounts.']
for name,s in schema['components']['schemas'].items(): lines.append('export type '+name+' = '+ts(s)+';')
Path('src/api/generated.ts').write_text('\n'.join(lines)+'\n')
Path('src/api/openapi.json').write_text(json.dumps(schema,ensure_ascii=False,indent=2)+'\n')
