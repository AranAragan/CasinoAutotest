import { BonusRpcClient } from '@greencodeorg/bonus-rpc/nest-client'
import { join } from 'path'
import { setProtobufWrappers } from '@greencodeorg/common-grpc'

export const bonusRpcClient = new BonusRpcClient({
  url: '206.189.251.143:3100',
  protoPath: join(
    process.cwd(),
    'node_modules/@greencodeorg/bonus-rpc/proto',
    'app.proto'
  )
})

setProtobufWrappers()
