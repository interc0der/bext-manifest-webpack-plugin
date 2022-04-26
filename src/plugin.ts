/**
 *  wext-manifest-webpack-plugin
 *
 *  @author   interc0der <https://github.com/interc0der>
 *  @license  GNU GENERAL PUBLIC LICENSE
 */

import { Compiler } from 'webpack';

const PLUGIN_NAME = 'wext-manifest-webpack-plugin';

/* type CompilationType = compilationType.Compilation;
type ModuleType = compilationType.Module;
type ChunkType = compilationType.Chunk;

interface CompilationModule extends ModuleType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resource?: string | any[];
} */

function getEntryResource(
  module:any/* : CompilationModule | undefined */
): string | null {
  const resource: string | null = null;

  if (module && typeof module.resource === 'string') {
    return module.resource;
  }

  return resource;
}

export class WextManifestWebpackPlugin {
  // Define `apply` as its prototype method which is supplied with compiler as its argument
  apply(compiler: Compiler): void {
    /**
     *  webpack 4+ comes with a new plugin system.
     *
     *  (// ToDo: support old plugin system //)
     */
    const { hooks } = compiler;

    // Check for hooks for 4+
    if (hooks) {

      // Runs plugin after a compilation has been created.
      hooks.compilation.tap(PLUGIN_NAME, (compilation: any) => {
        // Triggered when an asset from a chunk was added to the compilation.
        compilation.hooks.chunkAsset.tap(
          PLUGIN_NAME,
          (chunk: any, file: string) => {
            // Only handle js files with entry modules
            if (!file.endsWith('.js') || !chunk.hasEntryModule()) {
              return;
            }

            // Returns path containing name of asset
            const resource: null | string = getEntryResource(chunk.entryModule);
            const isManifest: boolean =
              (resource && /manifest\.json$/.test(resource)) || false;

            if (isManifest) {

              /*
              * Remove to prevent chunk.files.delete is not a function leading to a compilation break 
              *
              chunk.files = chunk.files.filter((f: string): boolean => {
                return f !== file;
              }); */

              delete compilation.assets[file];
              console.log(`${PLUGIN_NAME}: removed ${file}`);
            }
            
          }
        );
      });
    }
  }
}
