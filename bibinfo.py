# go over all pdfs in NIPS, get all the words from each, discard stop words,
# count frequencies of all words, retain top 100 for each PDF and dump a 
# pickle of results into topwords.p

import os
from string import punctuation
from operator import itemgetter
import re
import cPickle as pickle

class paper:
    def setID(self, id):
        self.id = id
    def setTitle(self, title):
        self.title = title
    def setAuthor(self, author):
        self.author = author
    def setYear(self, year):
        self.year = year
    def setSource(self, source):
        self.source = source
    def cout(self):
        print self.id,',', self.title,',', self.author,',', self.year,',', self.source
    def save(self):
        output = self.id + '|' + self.title + '|' + self.author + '|' + self.year + '|' + self.source + '\n'
        file.writelines(output)

def Split_file(file_name, paperid):
    f = open(file_name)
    content = []
    count = 1
    temp = paper()
    for each_line in f:
        #print each_line
        if each_line[1] != '=':
            if each_line[0] == '@':
                id = each_line.split('{', 1)[1]
                temp.setID(str(id[:-2]))
            #print temp.cout()
            if each_line.strip().startswith('title'):
                print each_line
                t1 = each_line.split('{', 1)[1]
                temp.setTitle(t1.split('}', 1)[0])
            if each_line.strip().startswith('author'):
                #print each_line
                a1 = each_line.split('{', 1)[1]
                temp.setAuthor(a1.split('}', 1)[0])
            if (each_line.strip().startswith('journal')) | (each_line.strip().startswith('book')):
                s1 = each_line.split('=', 1)[1]
                temp.setSource(s1.split(',', 1)[0])
            if each_line.strip().startswith('year'):
                y1 = each_line.split('=', 1)[1]
                temp.setYear(y1.split(',', 1)[0])
        else:
            #print id
            if id[:-2] == paperid:
                temp.save()
                print "saved" + id
    f.close()

N= 100 # how many top words to retain

# get list of all PDFs supplied by NIPS
relpath = "literature/"
allFiles = os.listdir(relpath)
pdfs = [x for x in allFiles if x.endswith(".pdf")]
file_name = 'bibinfo.txt'
file = open(file_name, 'w')
# go over every PDF, use pdftotext to get all words, discard boring ones, and count frequencies
topdict = {} # dict of paperid -> [(word, frequency),...]
for i,f in enumerate(pdfs):
    paperid = f[:-4]
    fullpath = relpath + f
    print "processing %s, %d/%d" % (paperid, i+1, len(pdfs))
    Split_file("bib.txt", paperid)
file.close()
print 'end'
