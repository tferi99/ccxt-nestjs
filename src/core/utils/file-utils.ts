import * as fs from 'fs';
import { Logger } from '@nestjs/common';

export function loadJsonFile(fname: string): object {
  const fileContents = fs.readFileSync(fname, 'utf8');

  // parse
  try {
    return JSON.parse(fileContents);
  } catch (err) {
    Logger.error('Error during parsing file from ' + fname + err);
    throw err;
  }
}
