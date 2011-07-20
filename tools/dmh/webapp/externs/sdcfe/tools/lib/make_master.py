#!/usr/bin/python

# This work is licensed under the Creative Commons Attribution 3.0 United 
# States License. To view a copy of this license, visit 
# http://creativecommons.org/licenses/by/3.0/us/ or send a letter to Creative
# Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.

import os
import Image

iconMapFile = open('icon_map.txt')
iconMap = sorted( line.rstrip().split(':') for line in iconMapFile.readlines()
                  if line.rstrip())
iconMapFile.close()

images = [Image.open(filename) for cssClass, filename in iconMap]

print "%d images will be combined." % len(images)

image_width, image_height = images[0].size

print "all images assumed to be %d by %d." % (image_width, image_height)

master_width = image_width
#seperate each image with lots of whitespace
master_height = (image_height * len(images) * 2) - image_height
print "the master image will by %d by %d" % (master_width, master_height)
print "creating image...",
master = Image.new(
    mode='RGBA',
    size=(master_width, master_height),
    color=(0,0,0,0))  # fully transparent

print "created."

for count, image in enumerate(images):
    location = image_height*count*2
    print "adding %s at %d..." % (iconMap[count][1], location),
    master.paste(image,(0,location))
    print "added."
print "done adding icons."

print "saving master.gif...",
master.save('master.gif', transparency=0 )
print "saved!"

print "saving master.png...",
master.save('master.png')
print "saved!"


cssTemplate = '''li.%s {
    background-image:url(/static/icons/master.%s);
    background-position: 6px %dpx;
}
'''

for format in ['png','gif']:
	print 'saving icons_%s.css...' % format,
	iconCssFile = open('icons_%s.css' % format ,'w')
	for count, pair in enumerate(iconMap):
		cssClass, filename = pair
		location = image_height*count*2
		iconCssFile.write( cssTemplate % (cssClass, format, 4-location) )
	iconCssFile.close()
	print 'created!'


