# Traffic Light Protocol (TLP) Zimlet German

This Zimlet for Zimbra provides functionality for classifying emails according to the Traffic Light Protocol (TLP) established by First.org. This version is translated to German and has been modified for HIN Secure Gateway.

## Features

- Adds a new button to the email compose toolbar for setting the TLP level of the email being composed.
- The TLP level of an email can be selected from a dropdown list in a dialog window that opens upon clicking the TLP button.
- Depending on the selected TLP level, the email subject and body are appropriately formatted.
- Supports both HTML and plain text email formats.
- TLP:RED adds [Vertraulich] to Subject as well, which forces HIN-Mail-Gateway to enforce encryption when sending eMail, while keeping TLP-Flag

## Installation

1. Download the Zimlet `.zip` file.
2. Deploy the Zimlet on your Zimbra server using the `zmzimletctl deploy` command.
3. Enable the Zimlet in the Zimbra admin console.

## Usage

When composing an email, click the TLP button to open a dialog where you can select the TLP level for the email. The available levels are RED, AMBER, GREEN, and WHITE. After selecting a level and clicking OK, the email subject and body will be appropriately formatted.

## Known Issues

- The subject line formatting using regular expressions may not work as expected if the TLP strings contain special characters that need to be escaped.

## Support

If you encounter any issues or have any questions about this Zimlet, please [open an issue on our GitHub page](*your GitHub issue page link here*).

