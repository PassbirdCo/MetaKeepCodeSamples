// This file contains bridge code to call native MetaKeep SDK functions from
// Unity.

#import "MetaKeepBridge.h"
#import "AppDelegateListener.h"
#import <MetaKeep/MetaKeep.h>

@interface MetaKeepBridge () <AppDelegateListener>

@property(nonatomic, copy) NSString *urlKey;
@property(nonatomic, copy) NSString *sourceApplicationKey;
@property(nonatomic, copy) NSString *annotationKey;

@end

@implementation MetaKeepBridge

- (instancetype)init {
  NSLog(@"MetaKeepBridge init");

  self = [super init];
  if (self) {
    _urlKey = @"url";
    _sourceApplicationKey = @"sourceApplication";
    _annotationKey = @"annotation";
    UnityRegisterAppDelegateListener(self);
  }
  return self;
}

- (void)onOpenURL:(NSNotification *)notification {
  NSDictionary *dic = [notification userInfo];
  NSURL *url = dic[self.urlKey];
  NSString *urlString = [url description];

  // Allow MetaKeep to handle the deep link URL.
  // If you are handling other deeplinks, you may want to add some logic
  // to only do this if the URL's format matches the one used by MetaKeep.
  [[MetaKeepMetaKeepCompanion companion] resumeUrl:urlString];
}

@end

// When native code plugin is implemented in .mm / .cpp file, then functions
// should be surrounded with extern "C" block to conform C function naming rules
// and avoid name mangling.
extern "C" {
MetaKeepBridge *bridge;

// Setup MetaKeep SDK.
const void _setupSDK() {
  if (bridge == nil) {
    bridge = [[MetaKeepBridge alloc] init];
  }
  return;
}

// Calls MetaKeep SDK signTransaction function.
const void _signTransaction() {
  // By default mono string marshaler creates .Net string for returned UTF-8 C
  // string and calls free for returned value, thus returned strings should be
  // allocated on heap

  MetaKeepMetaKeep *sdk = [[MetaKeepMetaKeep alloc]
      initWithAppId:@"289c1a16-3644-4645-a89c-3c9d40ac96fc"
         appContext:[MetaKeepAppContext alloc]];

  MetaKeepCallback *callback = [[MetaKeepCallback alloc]
      initWithOnSuccess:^(MetaKeepJsonResponse *success) {
        NSLog(@"Received success from MetaKeep: %@", [success description]);
      }
      onFailure:^(MetaKeepJsonResponse *failure) {
        NSLog(@"Received failure from MetaKeep: %@", [failure description]);
      }];

  // This goes in the field "serializedTransactionMessage" in the JSON string
  NSString *memoProgramMessageHex =
      @"0x01000102e639b944f5812819015b874752f56f4a2f06b31e3f38211646a651109e308"
      @"386054a535a992921064d24e87160da387c7c35b5ddbc92bb81e41fa8404105448d0000"
      @"00000000000000000000000000000000000000000000000000000000000001010100097"
      @"4657374206d656d6f";

  NSDictionary *transaction = @{
    @"serializedTransactionMessage" : memoProgramMessageHex,
  };

  NSString *jsonString = [[NSString alloc]
      initWithData:[NSJSONSerialization dataWithJSONObject:transaction
                                                   options:0
                                                     error:nil]
          encoding:NSUTF8StringEncoding];

  MetaKeepJsonRequest *request =
      [[MetaKeepJsonRequest alloc] initWithJsonString:jsonString error:nil];

  NSLog(@"Signing transaction with MetaKeep SDK: %@", [request description]);

  [sdk signTransactionTransaction:request
                           reason:@"Do you want to sell your trees?"
                         callback:callback];

  return;
}
}
