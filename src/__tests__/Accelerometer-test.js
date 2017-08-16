import { NativeModules } from 'react-native';

import { mockPlatformIOS } from './mocking';

let Accelerometer;

// NOTE(ide): Remove this after making the tests clean up side effects
beforeEach(() => {
  jest.resetModules();
  Accelerometer = require('../Accelerometer').default;
  expect(Accelerometer.hasListeners()).toBe(false);
});

it(`adds an "accelerometerDidUpdate" listener on iOS`, () => {
  mockPlatformIOS();
  const NativeAccelerometer = NativeModules.ExponentAccelerometer;

  const mockListener = jest.fn();
  const subscription = Accelerometer.addListener(mockListener);

  expect(NativeAccelerometer.addListener).toHaveBeenCalledTimes(1);
  expect(NativeAccelerometer.addListener).toHaveBeenCalledWith(
    'accelerometerDidUpdate'
  );

  subscription.remove();
  expect(NativeAccelerometer.removeListeners).toHaveBeenCalledTimes(1);
  expect(NativeAccelerometer.removeListeners).toHaveBeenCalledWith(1);
});

it(`notifies listeners`, () => {
  mockPlatformIOS();

  const mockListener = jest.fn();
  Accelerometer.addListener(mockListener);

  const mockEvent = { x: 0.2, y: 0.1, z: 0.3 };
  Accelerometer._emitter.emit('accelerometerDidUpdate', mockEvent);
  expect(mockListener).toHaveBeenCalledWith(mockEvent);
});

it(`sets the update interval`, async () => {
  const NativeAccelerometer = NativeModules.ExponentAccelerometer;
  await Accelerometer.setUpdateIntervalAsync(1234);
  expect(NativeAccelerometer.setUpdateInterval).toHaveBeenCalledTimes(1);
  expect(NativeAccelerometer.setUpdateInterval).toHaveBeenCalledWith(1234);
});
