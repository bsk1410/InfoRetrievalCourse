import json
import pandas as pd

filePath = '../data/'
fileName = 'republicanCandidateTimelines'

f = open(filePath+fileName)
outList = []

for line in f:
	l = json.loads(line)
	outList.append(pd.Series(l))

outDF = pd.DataFrame(outList)

#save to file
outDF.to_csv(filePath+fileName+'.csv',index=False,na_rep='NULL')