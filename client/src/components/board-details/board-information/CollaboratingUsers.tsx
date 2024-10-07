import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CollaboratingUsersProps {
  users: string[];
}

const CollaboratingUsers: React.FC<CollaboratingUsersProps> = ({ users }) => (
  <Card className="max-h-[480px] overflow-y-scroll lg:flex-[1]">
    <CardHeader>
      <CardTitle className="flex items-center text-2xl">Shared with</CardTitle>
      <CardDescription>
        <p className="text-sm">List of users the board has been shared with</p>
      </CardDescription>
    </CardHeader>

    <CardContent className="mt-4">
      <Table>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={index}>
              <TableCell className="flex items-center">
                <Avatar className="mr-2 h-8 w-8">
                  <AvatarImage src={`/avatars/${user}.png`} alt={user} />
                  <AvatarFallback>{user.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <p className="text-sm font-semibold">{user}</p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default CollaboratingUsers;
