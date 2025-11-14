class User {
  String? id;
  String name;
  String email;
  String? phone;
  String? address;
  String? photo;
  String? password; 
  String role;

  User({
    this.id,
    required this.name,
    required this.email,
    this.phone,
    this.address,
    this.photo,
    this.password,
    this.role = "User",
  });

  factory User.fromJson(Map<String, dynamic> json) => User(
        id: json['id']?.toString(),
        name: json['name'] ?? json['Name'] ?? "",
        email: json['email'] ?? json['Email'] ?? "",
        phone: json['phone'] ?? json['Phone'],
        address: json['address'] ?? json['Address'],
        photo: json['photo'] ?? json['Photo'],
        role: json['role'] ?? json['Role'] ?? "User",
      );

  Map<String, dynamic> toJson() => {
        if (id != null) 'id': id,
        'name': name,
        'email': email,
        if (phone != null) 'phone': phone,
        if (address != null) 'address': address,
        if (photo != null) 'photo': photo,
        if (password != null) 'password': password,
        'role': role,
      };

  static User empty() => User(
        id: null,
        name: "",
        email: "",
        role: "User",
      );
}
