const express = require("express");

const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.json({ message: "Hello !" });
});



// Start the Express server
app.listen(8181, () => {
    console.log("Server is running...");
});
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');
const fontSize = 10;

// Define the wrapText function
function wrapText(text, font, fontSize, maxWidth) {
    const lines = [];
    const words = text.split(' ');
    let currentLine = '';

    for (const word of words) {
        const testLine = currentLine === '' ? word : `${currentLine} ${word}`;
        const testLineWidth = font.widthOfTextAtSize(testLine, fontSize);

        if (testLineWidth > maxWidth) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }

    if (currentLine) {
        lines.push(currentLine);
    }

    return lines;
}

async function generatePDF(jsonData, outputFilePath) {
    // Create PDF document
    const doc = await PDFDocument.create();

    // Adjust the page width to a larger value
    const pageWidth = 600; // Adjust this value to increase the width of the page
    const pageHeight = 500;
    const page = doc.addPage([pageWidth, pageHeight]);

    // Define the border margin and width
    const borderMargin = 12;
    const borderWidth = 10;

    // Drawing border rectangle
    page.drawRectangle({
        x: borderMargin,
        y: borderMargin,
        width: pageWidth - 2 * borderMargin,
        height: pageHeight - 2 * borderMargin,
        color: rgb(0.8, 0.9, 1), // Light blue fill color
        borderWidth: borderWidth,
        borderColor: rgb(0.3, 0.5, 1), // Blue border color
    });

    // Drawing inner white rectangle
    const contentX = borderMargin + borderWidth;
    const contentY = borderMargin + borderWidth;
    const contentWidth = pageWidth - 2 * (borderMargin + borderWidth);
    const contentHeight = pageHeight - 2 * (borderMargin + borderWidth);
    page.drawRectangle({
        x: contentX,
        y: contentY,
        width: contentWidth,
        height: contentHeight,
        color: rgb(1, 1, 1), // White color
    });

    // Load fonts
    const helveticaFont = await doc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await doc.embedFont(StandardFonts.HelveticaBold);

    // Load images
    const imagePath = path.join('C:', 'Users', 'admin', 'Downloads', 'anmoltask', 'Simple-curd-master', 'download.jpeg');
    const imageBytes = await fs.readFile(imagePath);
    const image = await doc.embedJpg(imageBytes);

    const image2Path = path.join('C:', 'Users', 'admin', 'Downloads', 'anmoltask', 'Simple-curd-master', 'msme.png.jpg');
    const image2Bytes = await fs.readFile(image2Path);
    const image2 = await doc.embedJpg(image2Bytes);

    // Draw images
    // Adjust the size of the image and move it upward
    page.drawImage(image2, {
        x: pageWidth / 2 - 25, // Centered on the page; adjust the offset if needed
        y: pageHeight - 120, // Moves the image upward; increase value to move further up
        width: 80, // Decrease the width of the image
        height: 80, // Decrease the height of the image
    });

    const imageWidth = 100; // Your image width (100 in the provided snippet)
    const imageX = (pageWidth - imageWidth) / 2;

    page.drawImage(image, {
        x: imageX, // This keeps the image centered
        y: pageHeight - 470,
        width: imageWidth,
        height: 100, // You can keep the height the same or change it if necessary
    });
    const image2Width = image2.width;
    const image2Height = image2.height;

    const title = "Certificate of Half Marathon";
    const titleWidth = helveticaBoldFont.widthOfTextAtSize(title, 20);
    const titleX = (pageWidth - titleWidth) / 2;
    // Calculate the new y-coordinate for the title text
    // Move the title text closer to the image (increase the offset value if needed)
    const newTitleY = (pageHeight - 160); // Adjust based on the height of the image

    // Draw title text with the new y-coordinate
    page.drawText(title, {
        x: titleX, // Maintain the same x-coordinate to keep the text centered
        y: newTitleY, // Use the new y-coordinate to move the text upward
        size: 20,
        font: helveticaBoldFont,
        color: rgb(0.3, 0.5, 1),
    });

    // Define the font size for the text
    const fontSize = 10;

    // Define the right margin (distance from the right edge of the page)
    const rightMargin = 10;

    // Calculate the x-coordinate for the text
    const textX = pageWidth - rightMargin - 150; // Subtract 20 units to move the text left

    // Calculate the initial y-coordinate for the text to place it lower on the page
    const initialTextY = pageHeight - borderMargin - 70; // Adjust this value to lower the text on the page

    // Define the text content
    const registerIdText = `Register-Id: ${jsonData.registerId}`;
    const emailText = `E-Mail: ${jsonData.email}`;
    const phoneText = `Phone No.: ${jsonData.phone}`;

    // Draw the Register ID text at the specified location
    page.drawText(registerIdText, {
        x: textX,
        y: initialTextY,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    // Calculate the y-coordinate for the next line of text (move down further)
    const emailTextY = initialTextY - fontSize - 15; // Subtract font size and padding for spacing

    // Draw the E-Mail text at the specified location
    page.drawText(emailText, {
        x: textX,
        y: emailTextY,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    // Calculate the y-coordinate for the next line of text (move down further)
    const phoneTextY = emailTextY - fontSize - 15; // Subtract font size and padding for spacing

    // Draw the Phone No. text at the specified location
    page.drawText(phoneText, {
        x: textX,
        y: phoneTextY,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    // Define the text
    const presentedTo = "This Certificate Presented to";

    // Calculate the width of the text using the specified font and size
    const presentedToWidth = helveticaFont.widthOfTextAtSize(presentedTo, 14);

    // Calculate the x-coordinate to center the text on the page
    const presentedToX = (pageWidth - presentedToWidth) / 2;

    // Define the y-coordinate where the text should be placed
    const presentedToY = pageHeight - 250;

    // Draw the text on the page, centered
    page.drawText(presentedTo, {
        x: presentedToX, // X-coordinate calculated to center the text
        y: presentedToY, // Keep the y-coordinate consistent with your existing code
        size: 14,
        font: helveticaFont,
        color: rgb(0, 0, 0), // Black color for the text
    });

    // Recipient's name in bold
    // Define the text you want to center
    const nameText = jsonData.name;

    // Define the font size and font you want to use for the text
    const nameFontSize = 16; // Adjust this value as needed
    const nameFont = helveticaBoldFont; // Assuming you want to use bold font

    // Calculate the width of the text using the font and size
    const nameTextWidth = nameFont.widthOfTextAtSize(nameText, nameFontSize);

    // Calculate the x-coordinate to center the text on the page
    const nameTextX = (pageWidth - nameTextWidth) / 2;

    // Define the y-coordinate where you want the text to be placed
    // For example, you can adjust the y-coordinate based on the existing code
    const nameTextY = pageHeight - 270; // Adjust this value as needed

    // Draw the text centered on the page
    page.drawText(nameText, {
        x: nameTextX, // X-coordinate calculated to center the text
        y: nameTextY, // Y-coordinate where you want the text
        size: nameFontSize,
        font: nameFont,
        color: rgb(0, 0, 0), // Black color for the text
    });
    
    const addressX = 50; 
    const addressY = pageHeight - 90; 

    const address = "Anand Farm, Sector 22\nGurugram (122016)\n(Haryana) India";

    page.drawText(address, {
        x: addressX,
        y: addressY,
        size: 10, // Smaller font size (e.g., 10)
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });



    // Achievement text
    // Define the achievement text
const achievementText = "The certificate of achievement is awarded to individuals who have demonstrated outstanding performance in their field.";

// Wrap the achievement text
const wrappedAchievementText = wrapText(achievementText, helveticaFont, 12, pageWidth - 100);

// Define the initial y-coordinate (starting y-coordinate)
// Decrease this value to move the achievement text higher
let currentY = pageHeight - 300; // Adjusted starting y-coordinate (moved 40 units up from -370)

// Define the line height (spacing between lines)
const lineHeight = 14;

// Draw each line of the wrapped achievement text
wrappedAchievementText.forEach((line) => {
    page.drawText(line, {
        x: 50,
        y: currentY,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });
    currentY -= lineHeight;
});

// Define the date and time text
const dateTimeText = jsonData.dateTime;

// Decrease the y-coordinate for the date and time text
// This will move the date and time text higher on the page
const dateTimeY = pageHeight - 390; // Adjusted y-coordinate (moved 20 units up from -410)

// Draw the date and time text at the specified location
page.drawText(dateTimeText, {
    x: 50,
    y: dateTimeY,
    size: 12,
    font: helveticaFont,
    color: rgb(0, 0, 0),
});

    // Save the PDF document
    const pdfBytes = await doc.save();
    await fs.writeFile(outputFilePath, pdfBytes);
}

// JSON data
const jsonData = {
    registerId: '12297918',
    email: 'yadavrhr@gmail.com',
    phone: '+919910892371',
    name: 'Rajesh Yadav',
    dateTime: '23-11-2023 22:34:00'
};

// Generate PDF
const outputFilePath = 'output.pdf';
generatePDF(jsonData, outputFilePath)
    .then(() => console.log('PDF generated successfully'))
    .catch(error => console.error('Error generating PDF:', error));
