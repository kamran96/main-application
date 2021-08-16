import { jsPDF } from "jspdf";
import CSS from "./pdf";

export default function printDiv(PrintItem) {
  let Head = document.querySelector("head");
  var contents = PrintItem.innerHTML;
  var frame1: any = document.createElement("iframe");
  frame1.className = "printIFrame";
  frame1.name = "frame1";
  frame1.style.position = "absolute";
  frame1.style.top = "-1000000px";
  document.body.appendChild(frame1);
  var frameDoc = frame1.contentWindow
    ? frame1.contentWindow
    : frame1.contentDocument.document
    ? frame1.contentDocument.document
    : frame1.contentDocument;
  frameDoc.document.open();
  frameDoc.document.write(`<html><head>${Head.innerHTML}`);
  frameDoc.document.write("</head><body>");
  frameDoc.document.write(contents);
  frameDoc.document.write("</body></html>");

  frameDoc.document.close();

  setTimeout(async () => {
    await window.frames["frame1"].focus();
    await window.frames["frame1"].print();
    document.body.removeChild(frame1);
  }, 800);

  // let newWindow = window.print()

  // let newWindow = window.open("", "Print-Window");
  // newWindow.open();

  // newWindow.document.write(
  //   `
  //   <head>${Head.innerHTML}</head><body onload="window.print()" >${PrintItem.innerHTML}</body></html>`
  // );

  // setTimeout(() => {
  //   newWindow.document.close();
  //   newWindow.close();
  // }, 200);
}

export function DownloadPDF(printItem) {
  let printHTML = `<html><head>
  <link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
  ${CSS}
  </style>
  </head><body >${printItem.innerHTML}</body></html>`;

  console.log(printHTML, "print html");
  return printHTML;
}

// export default function printDsiv(divName, mrNo, invoiceNo) {
//   // Get HTML to print from element
//   const printContents = document.getElementById(divName).innerHTML;
//   let originalContents = document.body.innerHTML;
//   document.body.innerHTML = printContents;
//   document.title = `${mrNo ? mrNo + "/" : ""}${
//     invoiceNo ? invoiceNo + "/" : ""
//   }${formatedDate()}`;
//   window.print();
//   document.body.innerHTML = originalContents;
//   location.reload();
// }

export function ConvertDivToPDFAndDownload(printItem) {
  let pdf = new jsPDF("p", "pt", "A4");
  let printHTML = `<html><head>
  
  <style>
  ${CSS}
  </style>
  </head><body style='background: 'red' >${printItem.innerHTML}</body></html>`;
  pdf.html(`${printHTML}`, {
    callback: (doc) => {
      doc.save();
    },
  });
}
