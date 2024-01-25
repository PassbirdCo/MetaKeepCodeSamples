using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class KeyboardInputHandler : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {
        // Handle keyboard input for key S or tap on screen
        if (Input.GetKeyDown(KeyCode.S) || (
            Input.touchCount == 1 && Input.GetTouch(0).phase == TouchPhase.Began
        ))
        {
            Debug.Log("S key pressed or screen tapped");

#if !UNITY_EDITOR
            
            Debug.Log("Calling sign transaction");
            MetaKeep.SignTransaction();
#else
            Debug.Log("In editor, not calling sign transaction");
#endif
        }

    }
}
