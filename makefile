all: zimlet

zimlet: clean
	zip -j -r com_zimbra_tlp.zip com_zimbra_tlp/*.*

clean:
	rm -f com_zimbra_tlp.zip

.PHONY: all zimlet
