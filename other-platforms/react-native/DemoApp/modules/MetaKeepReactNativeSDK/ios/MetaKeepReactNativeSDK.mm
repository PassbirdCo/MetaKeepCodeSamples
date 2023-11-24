#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE (MetaKeepReactNativeSDK, NSObject)

// MetaKeep SDK init synchronous method
RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(initialize : (NSString *)appId)

// MetaKeep SDK sign message asynchronous method
RCT_EXTERN_METHOD(signMessage
                  : (NSString *)message withReason
                  : (NSString *)reason withResolver
                  : (RCTPromiseResolveBlock)resolve withRejecter
                  : (RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

@end
