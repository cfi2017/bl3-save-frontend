import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Character, CharacterWrapper, Item, ItemRequest, ProfileWrapper } from './model';
import { AssetService } from './asset.service';

declare function shutdown();
declare function setAssetDB(db: any, btik: any);

declare function decodeCharacter(data: Uint8Array, platform: string): string;
declare function encodeCharacter(character: CharacterWrapper, resultFactory: ((l: number) => Uint8Array), platform: string): Uint8Array;

declare function decodeProfile(data: Uint8Array, platform: string): string;
declare function encodeProfile(profile: ProfileWrapper, resultFactory: ((l: number) => Uint8Array), platform: string): Uint8Array;

declare function serialiseItem(itemJson: string): Uint8Array;
declare function deserialiseItem(serial: Uint8Array): string;
declare function serialiseItemBase64(itemJson: string): string;
declare function deserialiseItemBase64(serial: string): string;
declare function getSeedFromSerial(serial: Uint8Array): number;


@Injectable({
  providedIn: 'root'
})
export class WasmService {

  constructor(
    private assets: AssetService
  ) { }

  initialised = false;
  // @ts-ignore
  go: Go;
  module: WebAssembly.Module;
  instance: WebAssembly.Instance;

  // tslint:disable-next-line:variable-name
  _ready: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  get ready(): Observable<boolean> {
    return this._ready.asObservable().pipe(filter(v => !!v));
  }

  public async initialise() {
    if (this.initialised) return;
    this.initialised = true;

    if (!WebAssembly.instantiateStreaming) {
      WebAssembly.instantiateStreaming = async (resp, importObject) => {
        const source = await (await resp).arrayBuffer();
        return await WebAssembly.instantiate(source, importObject);
      };
    }

    // @ts-ignore
    this.go = new Go();
    const result = await WebAssembly.instantiateStreaming(fetch('/assets/scripts/core.wasm'), this.go.importObject);
    this.module = result.module;
    this.instance = result.instance;
    this.go.run(this.instance).then(() => console.warn('wasm exited'));
    setAssetDB(JSON.stringify(this.assets.getDB()), JSON.stringify(this.assets.getBtik()));
    this._ready.next(true);
  }

  public shutdown() {
    // @ts-ignore
    shutdown();
  }

  public decodeCharacter(data: Uint8Array, platform: string): CharacterWrapper & {items: ItemRequest} {
    return JSON.parse(decodeCharacter(data, platform));
  }

  public decodeProfile(data: Uint8Array, platform: string): ProfileWrapper & {items: Item[]} {
    return JSON.parse(decodeProfile(data, platform));
  }

  public encodeCharacter(character: CharacterWrapper, platform: string) {
    return encodeCharacter(character, l => new Uint8Array(l), platform);
  }

  public encodeProfile(profile: ProfileWrapper, platform: string) {
    return encodeProfile(profile, l => new Uint8Array(l), platform);
  }

}
