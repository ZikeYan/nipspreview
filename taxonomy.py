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
    def setSensor(self, sensor):
        self.sensor = sensor
    def setData(self, data):
        self.data = data
    def setRegu(self, regu):
        self.regu = regu
    def setOpti(self, opti):
        self.opti = opti
    def cout(self):
        print self.id,',', self.sensor,',', self.data,',', self.regu,',', self.opti
    def save(self):
        output = self.id + ',' + self.sensor + ',' + self.data + ',' + self.regu + ',' + self.opti + '\n'
        file.writelines(output)

def Split_file(file_name, paperid):
    f = open(file_name)
    content = []
    count = 1
    for each_line in f:
        a = re.split('[{}]+',each_line)
        id = a[1]
        seq = re.split('&',each_line)
        sensor = seq[1].strip()
        repre = seq[2].strip()
        data = seq[3].strip()
        regu = seq[4].strip()
        tem = seq[5].strip()
        opt = re.split('hline',tem)[0]
        opti = opt[:-4]
        temp = paper()
        temp.setID(id)
        temp.setSensor(sensor)
        temp.setData(data)
        temp.setRegu(regu)
        temp.setOpti(opti)
        #temp.cout()
        if paperid == temp.id:
            temp.save()
            print 'saved file'
    f.close()

N= 100 # how many top words to retain

# get list of all PDFs supplied by NIPS
relpath = "literature/"
allFiles = os.listdir(relpath)
pdfs = [x for x in allFiles if x.endswith(".pdf")]
file_name = 'taxo.txt'
file = open(file_name, 'w')
# go over every PDF, use pdftotext to get all words, discard boring ones, and count frequencies
topdict = {} # dict of paperid -> [(word, frequency),...]
for i,f in enumerate(pdfs):
    paperid = f[:-4]
    fullpath = relpath + f
    print "processing %s, %d/%d" % (paperid, i+1, len(pdfs))
    Split_file("taxonomy.txt", paperid)
file.close()
print 'end'
