#!/usr/bin/env node

/**
 * DIAGNOSTIC SCRIPT - CHECK FOR COMMON ISSUES
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Running diagnostic checks...\n');

let hasErrors = false;

// Check 1: package.json has correct dependencies
console.log('✅ Checking package.json...');
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  
  if (!pkg.dependencies.partysocket) {
    console.error('❌ Missing dependency: partysocket');
    hasErrors = true;
  } else {
    console.log('  ✅ partysocket installed');
  }
  
  if (!pkg.dependencies.partykit) {
    console.error('❌ Missing dependency: partykit');
    hasErrors = true;
  } else {
    console.log('  ✅ partykit installed');
  }
  
  if (!pkg.devDependencies.concurrently) {
    console.error('❌ Missing devDependency: concurrently');
    hasErrors = true;
  } else {
    console.log('  ✅ concurrently installed');
  }
} catch (e) {
  console.error('❌ Error reading package.json:', e.message);
  hasErrors = true;
}

// Check 2: No old Supabase files
console.log('\n✅ Checking for old Supabase files...');
const oldFiles = [
  'supabase-config.ts',
  'lib/storage.ts',
  'lib/realtime.ts',
  'SUPABASE_INSTANT_BROADCAST_COMPLETE.sql',
  'SUPABASE_SETUP_GUIDE_COMPLETE.md'
];

for (const file of oldFiles) {
  if (fs.existsSync(file)) {
    console.error(`❌ Old Supabase file still exists: ${file}`);
    hasErrors = true;
  } else {
    console.log(`  ✅ ${file} removed`);
  }
}

// Check 3: PartyKit files exist
console.log('\n✅ Checking for PartyKit files...');
const requiredFiles = [
  'party/server.ts',
  'lib/partykit-client.ts',
  'partykit.json'
];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ Missing file: ${file}`);
    hasErrors = true;
  } else {
    console.log(`  ✅ ${file} exists`);
  }
}

// Check 4: Check for old imports in components
console.log('\n✅ Checking components for old imports...');

function checkFileForOldImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const errors = [];
  
  if (content.includes("from '../../lib/storage'") || content.includes('from "../../lib/storage"')) {
    errors.push('Imports old storage lib');
  }
  
  if (content.includes("from '../../lib/realtime'") || content.includes('from "../../lib/realtime"')) {
    errors.push('Imports old realtime lib');
  }
  
  if (content.includes('supabase') && !filePath.includes('.md')) {
    errors.push('References supabase');
  }
  
  return errors;
}

function checkDirectory(dir, fileExtensions = ['.tsx', '.ts']) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== 'node_modules' && file !== '.git') {
      checkDirectory(filePath, fileExtensions);
    } else if (fileExtensions.some(ext => file.endsWith(ext))) {
      const errors = checkFileForOldImports(filePath);
      if (errors.length > 0) {
        console.error(`❌ ${filePath}:`);
        errors.forEach(err => console.error(`   - ${err}`));
        hasErrors = true;
      }
    }
  }
}

checkDirectory('components');
checkDirectory('contexts');

if (!hasErrors) {
  console.log('  ✅ No old imports found');
}

// Check 5: .env file
console.log('\n✅ Checking .env file...');
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf-8');
  if (envContent.includes('VITE_PARTYKIT_HOST')) {
    console.log('  ✅ .env has VITE_PARTYKIT_HOST');
  } else {
    console.warn('  ⚠️  .env missing VITE_PARTYKIT_HOST (will use default localhost:1999)');
  }
} else {
  console.log('  ℹ️  No .env file (will use default localhost:1999)');
}

// Check 6: Node modules installed
console.log('\n✅ Checking node_modules...');
if (!fs.existsSync('node_modules')) {
  console.error('❌ node_modules not found - run: npm install');
  hasErrors = true;
} else if (!fs.existsSync('node_modules/partysocket')) {
  console.error('❌ partysocket not installed - run: npm install');
  hasErrors = true;
} else if (!fs.existsSync('node_modules/partykit')) {
  console.error('❌ partykit not installed - run: npm install');
  hasErrors = true;
} else {
  console.log('  ✅ All dependencies installed');
}

// Summary
console.log('\n' + '='.repeat(60));
if (hasErrors) {
  console.log('❌ DIAGNOSTIC FAILED - Issues found!');
  console.log('\nFIX STEPS:');
  console.log('1. Run: npm install');
  console.log('2. Remove any old Supabase files listed above');
  console.log('3. Fix any import errors in components');
  console.log('4. Run this diagnostic again');
  console.log('\nSee INSTALLATION_GUIDE.md for detailed instructions.');
  process.exit(1);
} else {
  console.log('✅ ALL CHECKS PASSED!');
  console.log('\nYour system is ready to run!');
  console.log('\nSTART THE SYSTEM:');
  console.log('  npm run start:all');
  console.log('\nOr separately:');
  console.log('  Terminal 1: npm run party');
  console.log('  Terminal 2: npm run dev');
  console.log('\nThen open:');
  console.log('  Client: http://localhost:5173');
  console.log('  Admin:  http://localhost:5173#/admin');
  process.exit(0);
}
