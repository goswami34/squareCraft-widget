fp = open("text.txt", "w")
lines = ["Applet", "Banana", "Cherry", "Date", "Elderberry"]
fp.writelines(lines)
fp.close()