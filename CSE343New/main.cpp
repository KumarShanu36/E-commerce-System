#include <iostream>
#include <iomanip>
#include <cstring>
using namespace std;

const int MAX_STUDENTS = 20;
const int MAX_BOOKS = 30;
const int MAX_NAME_LENGTH = 50;

class Book {
private:
    char title[MAX_NAME_LENGTH];
    char author[MAX_NAME_LENGTH];
    int isbn;
    bool available;

public:
    Book() {
        strcpy(title, "Untitled");
        strcpy(author, "Unknown");
        isbn = 0;
        available = true;
    }

    void setBook(const char* t, const char* a, int i) {
        strcpy(title, t);
        strcpy(author, a);
        isbn = i;
        available = true;
    }

    void editBook() {
        cout << "Current title: " << title << endl;
        cout << "Enter new title: ";
        cin.ignore();
        cin.getline(title, MAX_NAME_LENGTH);
        cout << "Current author: " << author << endl;
        cout << "Enter new author: ";
        cin.getline(author, MAX_NAME_LENGTH);
        cout << "Book details updated successfully.\n";
    }

    void display() const {
        cout << "Title: " << title << "\nAuthor: " << author
             << "\nISBN: " << isbn
             << "\nAvailable: " << (available ? "Yes" : "No") << "\n\n";
    }

    bool isAvailable() const { return available; }
    int getISBN() const { return isbn; }
    const char* getTitle() const { return title; }

    void issueBook() { available = false; }
    void returnBook() { available = true; }
};

class Student {
private:
    int roll;
    char name[MAX_NAME_LENGTH];
    double balance;

public:
    Student() {
        roll = 0;
        strcpy(name, "Unknown");
        balance = 0.0;
    }

    void createAccount() {
        cout << "Enter roll number: ";
        cin >> roll;
        cin.ignore();
        cout << "Enter student name: ";
        cin.getline(name, MAX_NAME_LENGTH);
        cout << "Enter initial deposit (min Rs 50): ";
        cin >> balance;

        if (balance < 50) {
            cout << "Minimum deposit is Rs 50. Account not created.\n";
            roll = 0;
        } else {
            balance -= 20 + 30; 
            cout << "Account created successfully!\n";
        }
    }

    void display() const {
        cout << "Roll No: " << roll << "\nName: " << name
             << "\nBalance: Rs" << fixed << setprecision(2) << balance << "\n";
    }

    void deposit(double amount) {
        balance += amount;
        cout << "Amount deposited successfully! New balance: Rs"
             << fixed << setprecision(2) << balance << endl;
    }

    bool canIssue() const { return balance >= 2; }

    void deductIssueCharge() { balance -= 2; }

    int getRoll() const { return roll; }
    const char* getName() const { return name; }
    double getBalance() const { return balance; }
};

class Library {
private:
    Student students[MAX_STUDENTS];
    Book books[MAX_BOOKS];
    int studentCount;
    int bookCount;

public:
    Library() {
        studentCount = 0;
        bookCount = 0;
    }

    void addStudent() {
        if (studentCount >= MAX_STUDENTS) {
            cout << "Student limit reached.\n";
            return;
        }
        students[studentCount].createAccount();
        if (students[studentCount].getRoll() != 0)
            studentCount++;
    }

    int findStudent(int roll) {
        for (int i = 0; i < studentCount; i++) {
            if (students[i].getRoll() == roll)
                return i;
        }
        return -1;
    }

    void viewStudent(int roll) {
        int idx = findStudent(roll);
        if (idx == -1)
            cout << "Student not found.\n";
        else
            students[idx].display();
    }

    void depositToStudent(int roll, double amount) {
        int idx = findStudent(roll);
        if (idx == -1) {
            cout << "Student not found.\n";
            return;
        }
        students[idx].deposit(amount);
    }

    void displayAllStudents() {
        for (int i = 0; i < studentCount; i++) {
            students[i].display();
            cout << "-------------------\n";
        }
    }

    void addBook() {
        if (bookCount >= MAX_BOOKS) {
            cout << "Book limit reached.\n";
            return;
        }

        char title[MAX_NAME_LENGTH], author[MAX_NAME_LENGTH];
        int isbn;

        cin.ignore();
        cout << "Enter book title: ";
        cin.getline(title, MAX_NAME_LENGTH);
        cout << "Enter author name: ";
        cin.getline(author, MAX_NAME_LENGTH);
        cout << "Enter ISBN: ";
        cin >> isbn;

        if (findBook(isbn) != -1) {
            cout << "Book with this ISBN already exists.\n";
            return;
        }

        books[bookCount].setBook(title, author, isbn);
        bookCount++;
        cout << "Book added successfully!\n";
    }

    int findBook(int isbn) {
        for (int i = 0; i < bookCount; i++) {
            if (books[i].getISBN() == isbn)
                return i;
        }
        return -1;
    }

    void editBook(int isbn) {
        int idx = findBook(isbn);
        if (idx == -1) {
            cout << "Book not found.\n";
            return;
        }
        books[idx].editBook();
    }

    void viewBooks() {
        for (int i = 0; i < bookCount; i++) {
            books[i].display();
        }
    }

    void issueBook(int roll) {
        int sIdx = findStudent(roll);
        if (sIdx == -1) {
            cout << "Student not found.\n";
            return;
        }

        cout << "Available books:\n";
        for (int i = 0; i < bookCount; i++) {
            if (books[i].isAvailable())
                cout << i + 1 << ". " << books[i].getTitle()
                     << " (ISBN: " << books[i].getISBN() << ")\n";
        }

        int choice;
        cout << "Enter book number to issue (0 to cancel): ";
        cin >> choice;

        if (choice == 0)
            return;

        if (choice < 1 || choice > bookCount || !books[choice - 1].isAvailable()) {
            cout << "Invalid choice.\n";
            return;
        }

        if (!students[sIdx].canIssue()) {
            cout << "Insufficient balance to issue a book.\n";
            return;
        }

        books[choice - 1].issueBook();
        students[sIdx].deductIssueCharge();
        cout << "Book issued successfully! Rs2 deducted from balance.\n";
    }
};

int main() {
    Library lib;
    int option;
    string password;
    bool is_admin;

    while (true) {
        cout << "\nLogin as:\n1. Admin\n2. Student\n0. Exit\nEnter choice: ";
        cin >> option;
        if (option == 0) break;

        cout << "Enter password: ";
        cin >> password;
        if (password != "password") {
            cout << "Incorrect password.\n";
            continue;
        }

        is_admin = (option == 1);

        if (is_admin) {
            cout << "\nAdmin Menu:\n1. Add Book\n2. Edit Book\n3. View Books\n4. View Students\n";
            cout << "Enter option: ";
            cin >> option;

            switch (option) {
                case 1: lib.addBook(); break;
                case 2: {
                    int isbn;
                    cout << "Enter ISBN to edit: ";
                    cin >> isbn;
                    lib.editBook(isbn);
                    break;
                }
                case 3: lib.viewBooks(); break;
                case 4: lib.displayAllStudents(); break;
                default: cout << "Invalid option.\n";
            }
        } else {
            int roll;
            cout << "Enter roll number: ";
            cin >> roll;

            cout << "\nStudent Menu:\n1. Create Account\n2. View Balance\n3. Deposit Amount\n4. Issue Book\nEnter option: ";
            cin >> option;

            switch (option) {
                case 1: lib.addStudent(); break;
                case 2: lib.viewStudent(roll); break;
                case 3: {
                    double amount;
                    cout << "Enter amount to deposit: ";
                    cin >> amount;
                    lib.depositToStudent(roll, amount);
                    break;
                }
                case 4: lib.issueBook(roll); break;
                default: cout << "Invalid option.\n";
            }
        }
    }

    cout << "Exiting Library Management System.\n";
    return 0;
}

