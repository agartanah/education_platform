import amqp from 'amqplib';
import { EventMessage, BaseEventData } from '../types/index';

let channel: amqp.Channel | null = null;

export async function connectRabbitMQ(): Promise<void> {
  try {
    const connection = await amqp.connect(
      process.env.RABBITMQ_URL || 'amqp://localhost:5672',
    );

    channel = await connection.createChannel();
    await channel.assertExchange('education_events', 'topic', {
      durable: true,
    });
    console.log('RabbitMQ connected');
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
    throw error;
  }
}

export async function publishEvent<T extends BaseEventData>(
  eventType: string,
  data: T,
): Promise<void> {
  if (!channel) await connectRabbitMQ();

  const message: EventMessage<T> = {
    eventType,
    data,
    timestamp: new Date().toISOString(),
    eventId: Date.now().toString(36) + Math.random().toString(36),
  };

  channel!.publish(
    'education_events',
    eventType,
    Buffer.from(JSON.stringify(message)),
  );
  console.log(`Published: ${eventType}`);
}

export async function subscribeToEvent<T extends BaseEventData>(
  eventType: string,
  handler: (data: T) => Promise<void>,
  serviceName: string,
): Promise<void> {
  if (!channel) await connectRabbitMQ();

  const queueName = `${eventType}_${serviceName}`;
  const queue = await channel!.assertQueue(queueName, { durable: true });

  await channel!.bindQueue(queue.queue, 'education_events', eventType);

  channel!.consume(queue.queue, async (msg: amqp.ConsumeMessage | null) => {
    if (msg) {
      try {
        const message: EventMessage<T> = JSON.parse(msg.content.toString());
        await handler(message.data);
        channel!.ack(msg);
        console.log(`Processed: ${eventType}`);
      } catch (error) {
        console.error(`Error processing ${eventType}:`, error);
        channel!.nack(msg, false, false);
      }
    }
  });
}

export async function publishCourseEvent<T extends BaseEventData>(
  eventType: string,
  data: T,
): Promise<void> {
  return publishEvent(eventType, data);
}

export async function subscribeToCourseEvent<T extends BaseEventData>(
  eventType: string,
  handler: (data: T) => Promise<void>,
  serviceName: string,
): Promise<void> {
  return subscribeToEvent(eventType, handler, serviceName);
}
