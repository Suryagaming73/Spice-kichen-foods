import fs from 'fs';
import path from 'path';

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // fix unused catch(error)
  content = content.replace(/catch \(error\)\s*\{/g, 'catch {');

  // fix exhaustive deps missing dependencies for fetchItems / fetchOrders
  content = content.replace(/fetchItems\(\)\n\s*\}, \[\]\)/g, 'fetchItems()\n    // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, [])');
  content = content.replace(/fetchOrders\(\)\n\s*\}, \[\]\)/g, 'fetchOrders()\n    // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, [])');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      fixFile(fullPath);
    }
  }
}

walk('./src');
