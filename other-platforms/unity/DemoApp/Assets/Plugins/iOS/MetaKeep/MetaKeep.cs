#if UNITY_IOS

using UnityEngine;
using System.Runtime.InteropServices;

public class MetaKeep
{
    /* Interface to native implementation */

    [DllImport("__Internal")]
    private static extern void _signTransaction();
    public static void SignTransaction()
    {
        _signTransaction();
    }

    [DllImport("__Internal")]
    private static extern void _setupSDK();
    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
    public static void SetupSDK()
    {
        _setupSDK();
    }
}
#endif