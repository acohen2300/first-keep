import glob
h=open('src/shell-head.html').read()
t=open('src/shell-tail.html').read()
js=''.join(open(f).read() for f in sorted(glob.glob('src/[0-9][0-9]-*.js')))
open('first-keep.html','w').write(h+js.rstrip('\n')+'\n'+t)
