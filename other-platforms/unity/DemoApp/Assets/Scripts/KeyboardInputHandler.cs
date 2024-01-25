using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class KeyboardInputHandler : MonoBehaviour
{
    // Canvas text object
    public GameObject emailTextObject;

    // Email input field
    public GameObject emailInputField;

    // Translucent background
    public GameObject background;


    // Start is called before the first frame update
    void Start()
    {
        // Set email text object to empty string
        emailTextObject.GetComponent<UnityEngine.UI.Text>().text = "";

        // Register textField endEdit event
        emailInputField.GetComponent<UnityEngine.UI.InputField>().onEndEdit.AddListener(delegate
        {
            Debug.Log("End edit event");
            string email = emailInputField.GetComponent<UnityEngine.UI.InputField>().text.ToLower();

            Debug.Log("Email entered: " + email);

            // Check if email is valid
            if (email.Contains("@") && email.Contains("."))
            {
                Debug.Log("Email valid");

                // Set email text object to email input field text
                emailTextObject.GetComponent<UnityEngine.UI.Text>().text = "Welcome " + email + "!" +
                "\n\n\n" + "Press `S` or tap screen to sign transaction";

                // Hide email input field
                emailInputField.SetActive(false);

                // Hide translucent background
                background.SetActive(false);
            }
            else
            {
                Debug.Log("Email invalid");
            }
        });

    }

    // Update is called once per frame
    void Update()
    {
        // Return if no keyboard input
        if (Input.anyKey == false)
        {
            return;
        }

        // If email is not set, return
        if (emailTextObject.GetComponent<UnityEngine.UI.Text>().text == "")
        {
            Debug.Log("Email not set");
            return;
        }

        // Handle keyboard input for key S or tap on screen
        if (Input.GetKeyDown(KeyCode.S) || (
            Input.touchCount == 1 && Input.GetTouch(0).phase == TouchPhase.Began
        ))
        {
            Debug.Log("S key pressed or screen tapped");

#if !UNITY_EDITOR

            Debug.Log("Calling sign transaction");
            MetaKeep.SignTransaction(emailInputField.GetComponent<UnityEngine.UI.InputField>().text);
#else
            Debug.Log("In editor, not calling sign transaction");
#endif
        }

    }
}
