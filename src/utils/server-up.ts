import { Express } from 'express';
import { readFileSync, existsSync } from 'fs';
import * as http from 'http';
import * as https from 'https';

import { configService, SslConf } from '../config/env.config';

export class ServerUP {
  static #app: Express;

  static set app(e: Express) {
    this.#app = e;
  }

  static get https() {
    const { FULLCHAIN, PRIVKEY } = configService.get<SslConf>('SSL_CONF');
    
    // Log paths for debugging
    console.log('FULLCHAIN Path:', FULLCHAIN);
    console.log('PRIVKEY Path:', PRIVKEY);

    // Check if SSL files exist
    if (!FULLCHAIN || !existsSync(FULLCHAIN)) {
      throw new Error(`Certificado não encontrado no caminho: ${FULLCHAIN}`);
    }

    if (!PRIVKEY || !existsSync(PRIVKEY)) {
      throw new Error(`Chave privada não encontrada no caminho: ${PRIVKEY}`);
    }

    return https.createServer(
      {
        cert: readFileSync(FULLCHAIN),
        key: readFileSync(PRIVKEY),
      },
      ServerUP.#app,
    );
  }

  static get http() {
    return http.createServer(ServerUP.#app);
  }
}
