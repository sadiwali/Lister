import json

content = None
with open("shows.txt") as f:
    content = f.readlines()


# you may also want to remove whitespace characters like `` at the end of each line
content = [x.strip() for x in content]

with open("result.json", "w") as fW:
    fW.write("[")
    i = 0
    for line in content:
        if (line):
            if line[0] != "#":

                date = line[0:12].strip().replace("[", "").replace("]", "").replace("-", " ")
                title = line[13: line.rfind(" - ")].strip().replace('*', '')
                comment = line[line.rfind(" - ") + 2 : line.rfind("/") - 2].strip()
                rating = line[line.rfind("/") - 2 : line.rfind("/")].strip()

                if (i == 0):
                    fW.write("{")
                else:
                    fW.write(",{")
                fW.write("  \"title\": \"" + title + "\",")
                fW.write("  \"date\": \"" + date + "\",")
                fW.write("  \"comments\": \"" + comment + "\",")
                fW.write("  \"rating\": " + rating + "")
                fW.write("}")
                i+= 1

    fW.write("]")

print("done")

