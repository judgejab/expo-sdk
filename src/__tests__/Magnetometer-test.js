import { NativeModules } from 'react-native';

import Magnetometer from '../Magnetometer';
import MagnetometerUncalibrated from '../MagnetometerUncalibrated';
import { mockPlatformIOS } from './mocking';

describe(
  'Magnetometer',
  declareMagnetometerSpecs(Magnetometer, NativeModules.ExponentMagnetometer, {
    magnetometerDidUpdate: 'magnetometerDidUpdate',
  })
);

describe(
  'MagnetometerUncalibrated',
  declareMagnetometerSpecs(
    MagnetometerUncalibrated,
    NativeModules.ExponentMagnetometerUncalibrated,
    { magnetometerDidUpdate: 'magnetometerUncalibratedDidUpdate' }
  )
);

function declareMagnetometerSpecs(
  Magnetometer,
  NativeMagnetometer,
  eventNames
) {
  return () => {
    it(`adds an magnetometer update listener on iOS`, () => {
      mockPlatformIOS();

      const mockListener = jest.fn();
      const subscription = Magnetometer.addListener(mockListener);

      expect(NativeMagnetometer.addListener).toHaveBeenCalledTimes(1);
      expect(NativeMagnetometer.addListener).toHaveBeenCalledWith(
        eventNames.magnetometerDidUpdate
      );

      subscription.remove();
      expect(NativeMagnetometer.removeListeners).toHaveBeenCalledTimes(1);
      expect(NativeMagnetometer.removeListeners).toHaveBeenCalledWith(1);
    });

    it(`notifies listeners`, () => {
      mockPlatformIOS();

      const mockListener = jest.fn();
      const subscription = Magnetometer.addListener(mockListener);

      const mockEvent = { x: 0.2, y: 0.1, z: 0.3 };
      Magnetometer._emitter.emit(eventNames.magnetometerDidUpdate, mockEvent);
      expect(mockListener).toHaveBeenCalledWith(mockEvent);

      subscription.remove();
    });

    it(`sets the update interval`, async () => {
      await Magnetometer.setUpdateIntervalAsync(1234);
      expect(NativeMagnetometer.setUpdateInterval).toHaveBeenCalledTimes(1);
      expect(NativeMagnetometer.setUpdateInterval).toHaveBeenCalledWith(1234);
    });
  };
}
