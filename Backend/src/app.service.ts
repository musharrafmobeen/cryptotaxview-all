import { Injectable } from '@nestjs/common';
// This function detects most providers injected at window.ethereum
import detectEthereumProvider from '@metamask/detect-provider';

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    // if (typeof window.ethereum === 'undefined') {
    //   console.log('MetaMask is not installed!');
    // }
    debugger;
    const provider = await detectEthereumProvider();
    debugger;

    if (provider) {
      // From now on, this should always be true:
      // provider === window.ethereum
      // startApp(provider); // initialize your app
      // console.log('is Provider');
    } else {
      // console.log('Please install MetaMask!');
    }
    return 'Hello World!';
  }
}
