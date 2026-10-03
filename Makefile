all:
	odin build . -out:arkonavt -o:speed
clean:
	rm -f ./arkonavt
run:
	./arkonavt
