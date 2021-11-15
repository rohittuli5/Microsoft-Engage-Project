from tkinter import *
import requests
if __name__ == '__main__':
    window = Tk()
    window.title("Procto Desktop App")
    w, h = window.winfo_screenwidth(), window.winfo_screenheight()
    window.geometry("%dx%d+0+0" % (w, h))


    email = StringVar(window)
    password = StringVar(window)
    status = StringVar(window)
    
    def login():
        response = requests.post("https://online-exam-proctoring.herokuapp.com/api/users/login", data={
            'email':email.get(),
            'password':password.get()        
            })
        if response.status_code == '200' or response.status_code == '200':
            status.set("Logged In!")
        else:
            status.set("Wrong Credentials")
        return
            
    
    heading = Label(window, bg='green', fg='yellow', font=('Arial', 20), width=20, text="PROCTO Desktop Client").grid(
        row=0,
        columnspan=5,
        pady=7)
    email_text = Label(window, text="Email").grid(row=1, column=2,pady=7)
    email_field = Entry(window, textvariable=email).grid(row=1,column=3, pady=7, padx=3)
    password_text = Label(window, text="Password").grid(row=2, column=2,pady=7)
    password_field = Entry(window, textvariable=password).grid(row=2,column=3, pady=7, padx=3)
    error_field = Label(window, textvariable=status).grid(row=4, column=2, rowspan=2, columnspan=2, pady=7)
    login_button = Button(window, text='Login', width=10, height=2, command=login)
    login_button.grid(row=3, column=2, padx=2, pady=7)
    

    window.mainloop()

