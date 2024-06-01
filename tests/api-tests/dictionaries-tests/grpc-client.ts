import { HandbookRpcClient } from '@greencodeorg/handbook-rpc/nest-client'
import { join } from 'path'
import { setProtobufWrappers } from '@greencodeorg/common-grpc'

export const handbookAppRpcClient = new HandbookRpcClient({
  url: '206.189.251.143:3100',
  protoPath: join(
    process.cwd(),
    'node_modules/@greencodeorg/handbook-rpc/proto',
    'app.proto'
  ),
});
setProtobufWrappers()
