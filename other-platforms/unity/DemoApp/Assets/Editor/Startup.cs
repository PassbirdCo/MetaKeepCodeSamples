using UnityEngine;
using UnityEditor;

[InitializeOnLoad]
public class Startup
{
    static Startup()
    {
        Debug.Log("Up and running");

        // Switch to iOS platform
        EditorUserBuildSettings.SwitchActiveBuildTarget(BuildTargetGroup.iOS, BuildTarget.iOS);
    }
}

