# Figma MCP Utilities

This directory contains utilities for interacting with Figma files through the Figma API.

## List Frames

The `listFrames.ts` script can be used to list all frames in a Figma file.

### Setup

1. Get your Figma Personal Access Token:
   - Go to Figma → Settings → Account
   - Generate a personal access token

2. Get your Figma File Key:
   - Open your Figma file in the browser
   - The file key is in the URL: `https://www.figma.com/file/[FILE_KEY]/...`

3. Set environment variables (optional):
   ```bash
   FIGMA_FILE_KEY=your-file-key
   FIGMA_ACCESS_TOKEN=your-access-token
   ```

### Usage

#### As a Node.js script:
```bash
npx tsx src/components/figmaMCP/listFrames.ts <file-key> <access-token>
```

#### As a TypeScript module:
```typescript
import { listFrames } from '@/components/figmaMCP/listFrames';

const frames = await listFrames('file-key', 'access-token');
console.log(frames);
```

#### Using environment variables:
```bash
export FIGMA_FILE_KEY=your-file-key
export FIGMA_ACCESS_TOKEN=your-access-token
npx tsx src/components/figmaMCP/listFrames.ts
```

### Example Output

```
Found 5 frame(s):

1. Login Screen (FRAME)
   ID: 123:456

2. Dashboard (FRAME)
   ID: 123:789

3. Navigation Bar (COMPONENT)
   ID: 123:101
```










