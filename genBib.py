# go over all pdfs in NIPS, get all the words from each, discard stop words,
# count frequencies of all words, retain top 100 for each PDF and dump a 
# pickle of results into topwords.p

import os
from string import punctuation
from operator import itemgetter
import re
import cPickle as pickle

def save_file(id,content):
    file_name = 'bib/' + id + '.html'
    file = open(file_name, 'w')
    file.writelines(content)
    #file.writelines('\n')
    file.close()

def Split_file(file_name, paperid):
    f = open(file_name)
    content = []
    count = 1
    for each_line in f:
        #print each_line
        if each_line[1] != '=':
            if each_line[0] == '@':
                id = each_line.split('{', 1)[1]
                id = str(id[:-2])
            content.append(each_line+'\n')
            #content.append('\n')
            count += 1
        else:
            #print id
            if id == paperid:
                save_file(id,content)
                print "saved" + id
            content = []
            #print count
            count = 1
    f.close()

N= 100 # how many top words to retain

# get list of all PDFs supplied by NIPS
relpath = "literature/"
allFiles = os.listdir(relpath)
pdfs = [x for x in allFiles if x.endswith(".pdf")]

# go over every PDF, use pdftotext to get all words, discard boring ones, and count frequencies
topdict = {} # dict of paperid -> [(word, frequency),...]
for i,f in enumerate(pdfs):
    paperid = f[:-4]
    fullpath = relpath + f
    print "processing %s, %d/%d" % (paperid, i+1, len(pdfs))
    Split_file("bib.txt", paperid)
print 'end'
