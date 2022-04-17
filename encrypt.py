""" Encrypts the given input string
    input - the string to be encrypted
    return - the encrypted string
"""
def encrypt(input: str):
    reverse = input[::-1]
    output = ""
    for i in range(len(reverse)):
        output += chr((ord(reverse[i]) - 34 -  13) % 93 + 34)
    return output


""" Unencrypts an encrypted input string
    input - the encrypted string
    return - the original string before encryption
"""
def unencrypt(input: str):
    reverse = input[::-1]
    output = ""
    for i in range(len(reverse)):
        output += chr((ord(reverse[i]) - 34 + 13) % 93 + 34)
    return output
