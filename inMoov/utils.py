def percent_of(percent, max) :
    return (percent * max / 100)


def is_minus(degree) :
    if '-' in degree :
        return ("-")
    return ("")

def moveHeadTo(head, degree) :
    eyes = False
    if degree[0] == 'x' :
        print("Xeyes")
        tmp = "a" + is_minus(degree) + "20,\n"
        head.write(tmp.encode())
        eyes = True
    elif degree[0] == 'y' :
        print("Yeyes")
        tmp = "b" + is_minus(degree) + "20,\n"
        head.write(tmp.encode())
        eyes = True
    head.write(degree.encode())
    if eyes == True :
        head.write("r0,\n".encode())
