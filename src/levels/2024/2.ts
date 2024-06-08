import { registerLevel } from '../../register'

// npx esbuild --bundle src/components/amw.ts --outfile=src/components/amw/builds/2024-06-08.js --format=cjs
import amw from '../../components/amw/builds/2024-06-08.js'

registerLevel('2024/2', amw)
