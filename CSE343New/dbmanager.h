#ifndef DBMANAGER_H
#define DBMANAGER_H

#include <QtSql>
#include <QString>

class DBManager {
public:
    DBManager(const QString& path);
    ~DBManager();

    bool isOpen() const;

    // Student operations
    bool addStudent(int roll, const QString& name, double balance);
    bool updateStudentBalance(int roll, double newBalance);
    bool getStudent(int roll, QString& name, double& balance);

    // Book operations
    bool addBook(int isbn, const QString& title, const QString& author);
    bool editBook(int isbn, const QString& newTitle, const QString& newAuthor);
    bool getBook(int isbn, QString& title, QString& author, bool& available);
    bool setBookAvailability(int isbn, bool available);

private:
    QSqlDatabase m_db;
};

#endif // DBMANAGER_H
