#include "gui_library.h"
#include "ui_gui_library.h"
#include <QMessageBox>

LibraryGUI::LibraryGUI(QWidget *parent)
    : QMainWindow(parent), ui(new Ui::LibraryGUI) {
    ui->setupUi(this);
    db = new DBManager("library.db");
    if (!db->isOpen())
        QMessageBox::critical(this, "Error", "Database could not be opened!");
}

LibraryGUI::~LibraryGUI() {
    delete ui;
    delete db;
}

void LibraryGUI::on_addStudentButton_clicked() {
    int roll = ui->rollInput->text().toInt();
    QString name = ui->nameInput->text();
    double deposit = ui->balanceInput->text().toDouble();

    if (deposit < 50) {
        QMessageBox::warning(this, "Error", "Minimum deposit is ₹50.");
        return;
    }

    double balance = deposit - 50;
    if (db->addStudent(roll, name, balance))
        QMessageBox::information(this, "Success", "Student added successfully.");
    else
        QMessageBox::warning(this, "Error", "Failed to add student.");
}

void LibraryGUI::on_addBookButton_clicked() {
    int isbn = ui->isbnInput->text().toInt();
    QString title = ui->titleInput->text();
    QString author = ui->authorInput->text();

    if (db->addBook(isbn, title, author))
        QMessageBox::information(this, "Success", "Book added successfully.");
    else
        QMessageBox::warning(this, "Error", "Failed to add book.");
}

void LibraryGUI::on_viewStudentsButton_clicked() {
    QSqlQuery query("SELECT * FROM students");
    QString output = "Roll\tName\tBalance\n------------------------\n";
    while (query.next())
        output += QString("%1\t%2\t%3\n").arg(query.value(0).toInt())
                                          .arg(query.value(1).toString())
                                          .arg(query.value(2).toDouble());
    QMessageBox::information(this, "Students", output);
}

void LibraryGUI::on_viewBooksButton_clicked() {
    QSqlQuery query("SELECT * FROM books");
    QString output = "ISBN\tTitle\tAuthor\tAvailable\n------------------------\n";
    while (query.next())
        output += QString("%1\t%2\t%3\t%4\n").arg(query.value(0).toInt())
                                              .arg(query.value(1).toString())
                                              .arg(query.value(2).toString())
                                              .arg(query.value(3).toInt() ? "Yes" : "No");
    QMessageBox::information(this, "Books", output);
}
