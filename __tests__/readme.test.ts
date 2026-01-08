/**
 * Feature: interior-dost-mvp
 * Tests for README.md existence and required sections
 * Validates: Requirements 8.5
 */

import * as fs from 'fs';
import * as path from 'path';

describe('README.md', () => {
  const readmePath = path.join(__dirname, '..', 'README.md');
  let readmeContent: string;

  beforeAll(() => {
    // Read README file once for all tests
    if (fs.existsSync(readmePath)) {
      readmeContent = fs.readFileSync(readmePath, 'utf-8');
    }
  });

  test('should exist in the project root', () => {
    expect(fs.existsSync(readmePath)).toBe(true);
  });

  test('should contain project overview section', () => {
    expect(readmeContent).toMatch(/##\s*Overview/i);
  });

  test('should contain setup instructions section', () => {
    expect(readmeContent).toMatch(/##\s*Setup\s*Instructions/i);
  });

  test('should contain demo flow section', () => {
    expect(readmeContent).toMatch(/##\s*Demo\s*Flow/i);
  });

  test('should contain known limitations section', () => {
    expect(readmeContent).toMatch(/##\s*Known\s*Limitations/i);
  });

  test('should contain technology stack section', () => {
    expect(readmeContent).toMatch(/##\s*Technology\s*Stack/i);
  });

  test('should mention API requirements', () => {
    expect(readmeContent.toLowerCase()).toContain('api');
    expect(readmeContent.toLowerCase()).toMatch(/replicate|gemini|openai/);
  });

  test('should mention API costs', () => {
    expect(readmeContent.toLowerCase()).toContain('cost');
  });

  test('should include clone instructions', () => {
    expect(readmeContent.toLowerCase()).toContain('clone');
  });

  test('should include install instructions', () => {
    expect(readmeContent.toLowerCase()).toContain('install');
  });

  test('should include environment variable setup', () => {
    expect(readmeContent.toLowerCase()).toMatch(/env|environment/);
  });

  test('should mention API dependencies limitation', () => {
    expect(readmeContent.toLowerCase()).toContain('api dependencies');
  });

  test('should mention single image limitation', () => {
    expect(readmeContent.toLowerCase()).toMatch(/single image|one image/);
  });

  test('should mention no persistence limitation', () => {
    expect(readmeContent.toLowerCase()).toMatch(/no persistence|no database/);
  });
});
