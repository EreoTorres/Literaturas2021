function visualizador_js(pdf) {
  console.log('visualizar.js');
  // console.log(pdf);
  // console.log("La resolución de tu pantalla es: " + screen.width + " x " + screen.height);

  let height = screen.height;
  let width = screen.width;

  var bookOptions = {
    height   : height,
    width    : width,
    maxWidth : width,
    maxHeight : height,
    centeredWhenClosed : true,
    style: 'wowbook-cs-white',
    hardcovers : true,
    pageNumbers: true,
    toolbar : "lastLeft, left, currentPage, right, lastRight, zoomin, zoomout, slideshow, flipsound, fullscreen, thumbnails, download",
    thumbnailsPosition : 'left',
    responsiveHandleWidth : 50,
    container: window,
    containerBackground: '#e4e4e4',
    containerPadding: "5px",
    toolbarContainerPosition: "bottom",
    pdf: pdf
 };

 $('#book').wowBook(bookOptions);
}
