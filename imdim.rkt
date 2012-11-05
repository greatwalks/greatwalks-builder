(module width racket
  (require racket/draw)
  (provide get-dims)
  (define args (command-line
	#:program "imdim.exe"
	#:args (str filename)
	(list str filename)))
  (define (get-dims)
    (let* ((bm (read-bitmap (cadr args) 'unknown))
		   (width  (number->string (send bm get-width)))
		   (height (number->string (send bm get-height)))
		   (str-unesced-% (regexp-replace* #px"\\\\%" (car args) "%"))
		   (str-with-h (regexp-replace #rx"%h" str-unesced-% height))
		   (str-with-w&h (regexp-replace #rx"%w" str-with-h width)))
		  (display str-with-w&h)))
  (get-dims))
