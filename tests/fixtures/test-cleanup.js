/**
 * Helper function to delete obsolete test files
 */
import fs from 'fs';
import path from 'path';

/**
 * Delete obsolete test files that are no longer used
 * @returns {Array} Array of deleted file paths
 */
export function deleteObsoleteTests() {
  const testsDir = path.resolve(process.cwd(), 'tests/functional');
  const deletedFiles = [];

  // Files to delete
  const filesToDelete = [
    'pages-fixed.test.js',
    'items-fixed.test.js'
  ];

  filesToDelete.forEach(file => {
    const filePath = path.join(testsDir, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      deletedFiles.push(filePath);
    }
  });

  return deletedFiles;
}