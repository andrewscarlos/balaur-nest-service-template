import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { grpcClientOptions, grpcPort } from './grpc-client.options';
import { GeneralErrorFilter } from './common/filters/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
const logger = new Logger('Main');

const bootstrap = async () => {
  const restPort = 3001;
  process.env.REST_PORT = restPort.toString();
  process.env.GRPC_PORT = grpcPort.toString();
  const app = await NestFactory.create(AppModule);
  if (process.env.APPLICATION_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Balaur-Nest-Service-Template')
      .setDescription('Balaur Nest Service Template')
      .setVersion('0.0.1')
      .addTag('PCoin')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'JWT',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('doc', app, document);
  }
  app.useGlobalFilters(new GeneralErrorFilter(logger));
  app.connectMicroservice<MicroserviceOptions>(grpcClientOptions);
  await app.startAllMicroservicesAsync();
  await app.listen(restPort);
  logger.log(
    '🍻️ Balaur Nest Service Template REST layer listening on port ' + restPort,
  );
  logger.log(
    '🍻️ Balaur Nest Service Template gRPC layer listening on port ' + grpcPort,
  );
};

bootstrap();
